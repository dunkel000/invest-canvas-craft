-- Create function to calculate and update portfolio performance time series
CREATE OR REPLACE FUNCTION public.update_portfolio_performance(_portfolio_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  _user_id uuid;
  _total_value numeric := 0;
  _previous_value numeric := 0;
  _daily_return numeric := 0;
  _daily_return_percentage numeric := 0;
  _today date := CURRENT_DATE;
BEGIN
  -- Get portfolio owner
  SELECT user_id INTO _user_id 
  FROM public.portfolios 
  WHERE id = _portfolio_id;
  
  IF _user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate total portfolio value from current assets
  SELECT COALESCE(SUM(total_value), 0) INTO _total_value
  FROM public.assets
  WHERE portfolio_id = _portfolio_id;
  
  -- Get previous day's value
  SELECT total_value INTO _previous_value
  FROM public.portfolio_performance
  WHERE portfolio_id = _portfolio_id
    AND date = _today - INTERVAL '1 day'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Calculate daily return
  IF _previous_value > 0 THEN
    _daily_return := _total_value - _previous_value;
    _daily_return_percentage := (_daily_return / _previous_value) * 100;
  END IF;
  
  -- Insert or update today's performance record
  INSERT INTO public.portfolio_performance (
    portfolio_id,
    user_id,
    date,
    total_value,
    daily_return,
    daily_return_percentage
  )
  VALUES (
    _portfolio_id,
    _user_id,
    _today,
    _total_value,
    _daily_return,
    _daily_return_percentage
  )
  ON CONFLICT (portfolio_id, date)
  DO UPDATE SET
    total_value = EXCLUDED.total_value,
    daily_return = EXCLUDED.daily_return,
    daily_return_percentage = EXCLUDED.daily_return_percentage,
    created_at = now();
  
  -- Update portfolio total value
  UPDATE public.portfolios
  SET total_value = _total_value,
      updated_at = now()
  WHERE id = _portfolio_id;
  
  RETURN TRUE;
END;
$function$

-- Create trigger function to automatically update performance when assets change
CREATE OR REPLACE FUNCTION public.trigger_update_portfolio_performance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Handle INSERT and UPDATE
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.update_portfolio_performance(NEW.portfolio_id);
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    PERFORM public.update_portfolio_performance(OLD.portfolio_id);
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$function$

-- Create trigger on assets table
DROP TRIGGER IF EXISTS assets_performance_update ON public.assets;
CREATE TRIGGER assets_performance_update
  AFTER INSERT OR UPDATE OR DELETE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_portfolio_performance();