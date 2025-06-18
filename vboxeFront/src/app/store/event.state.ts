import { Injectable } from '@angular/core';import {
    Action,
    Selector,
    State,
    StateContext,
    Store
} from '@ngxs/store';
import { CalendarEvent } from '../pages/calendar/calendar/calendar.types';
  

export interface CalendarEventStateModel {
    calendarEvents: CalendarEvent[];
    habilitations: Array<string>;
}

export class AddCalendarEvent {
    static readonly type = '[Calendar] Add Event';
    constructor(public payload: CalendarEvent) {}
  }

export class RemoveEvent {
    static readonly type = '[CalendarEvent] remove'
    constructor(public payload: string){}
}

const stateDefaults: CalendarEventStateModel = {
    calendarEvents: null,
    habilitations: [],
};
@State<CalendarEventStateModel>({
    name: 'event',
    defaults: stateDefaults
})
@Injectable({
    providedIn: 'root'
})
export class CalendarEventState {
    constructor() { }

    @Selector()
    static getEvent(state: CalendarEventStateModel) {
      return state.calendarEvents;
    }

    @Action(AddCalendarEvent)
    addEvent(ctx: StateContext<CalendarEventStateModel>, action: AddCalendarEvent) {
      const state = ctx.getState();
      const newEvent = action.payload;
  
      // Update the state with the new event added
      ctx.setState({
        ...state,
        calendarEvents: [...state.calendarEvents, newEvent]
      });
    }
}  