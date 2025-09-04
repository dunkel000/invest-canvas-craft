import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Flag, TrendingUp, Bell } from "lucide-react";
import { format, isSameDay, addDays } from "date-fns";

interface EconomicEvent {
  id: string;
  date: Date;
  time: string;
  title: string;
  country: string;
  impact: "low" | "medium" | "high";
  previous: number | string;
  forecast: number | string;
  actual?: number | string;
  currency: string;
  category: string;
  description: string;
}

interface EconomicCalendarProps {
  events: EconomicEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const EconomicCalendar = ({ events, selectedDate, onDateSelect }: EconomicCalendarProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'EU': '🇪🇺',
      'GB': '🇬🇧',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'CH': '🇨🇭'
    };
    return flags[country] || '🌍';
  };

  const todayEvents = events.filter(event => isSameDay(event.date, selectedDate));
  const upcomingEvents = events.filter(event => 
    event.date > selectedDate && event.date <= addDays(selectedDate, 7)
  );

  const getDateEvents = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Economic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, index) => {
              const dayEvents = getDateEvents(date);
              const hasHighImpact = dayEvents.some(e => e.impact === "high");
              const isSelected = isSameDay(date, selectedDate);
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-16 flex flex-col gap-1 relative ${
                    hasHighImpact ? 'border-destructive' : ''
                  }`}
                  onClick={() => onDateSelect(date)}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(date, 'EEE')}
                  </div>
                  <div className="text-sm font-medium">
                    {format(date, 'd')}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">
                      {dayEvents.length}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Events ({todayEvents.length})</span>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Set Alerts
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No economic events scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getCountryFlag(event.country)}</div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {event.time} {event.currency}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getImpactColor(event.impact)} className="capitalize">
                        {event.impact}
                      </Badge>
                      <Badge variant="outline">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Previous</div>
                      <div className="font-medium">{event.previous}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Forecast</div>
                      <div className="font-medium">{event.forecast}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Actual</div>
                      <div className={`font-medium ${
                        event.actual 
                          ? event.actual > event.forecast 
                            ? 'text-primary' 
                            : 'text-destructive'
                          : 'text-muted-foreground'
                      }`}>
                        {event.actual || '-'}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>This Week ({upcomingEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm">{getCountryFlag(event.country)}</div>
                  <div>
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(event.date, 'MMM d')} at {event.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getImpactColor(event.impact)} className="text-xs">
                    {event.impact}
                  </Badge>
                  {event.impact === "high" && (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {upcomingEvents.length > 10 && (
            <Button variant="outline" className="w-full mt-4">
              View All {upcomingEvents.length} Events
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};