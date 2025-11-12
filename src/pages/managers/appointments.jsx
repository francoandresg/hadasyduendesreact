import { useEffect, useRef, useState } from 'react';

// Hooks
import useMediaQuery from '@mui/material/useMediaQuery';
import useAuth from 'hooks/useAuth';

// Material UI
import { Grid, Card, CardContent } from '@mui/material';

// Icons
import { UserIcon, PhoneIcon, BriefcaseIcon, MagnifyingGlassIcon, TrashIcon } from '@phosphor-icons/react';

// FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

// Components
import SimpleBar from 'components/third-party/SimpleBar';
import CalendarStyled from '../../sections/apps/calendar/CalendarStyled';
import Toolbar from '../../sections/apps/calendar/toolbar';

// Toast
import { openSnackbar } from 'utils/snackbar';

import dayjs from 'dayjs';

export default function WidgetAppointments() {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);

  const [date, setDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState();
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = matchDownSM ? 'listWeek' : 'dayGridMonth';
      calendarApi.changeView(newView);
      setCalendarView(newView);
    }
  }, [matchDownSM]);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()} ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleDateToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setDate(calendarApi.getDate());
  };

  const handleViewChange = (newView) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(newView);
    setCalendarView(newView);
  };

  const handleDatePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDate(calendarApi.getDate());
  };

  const handleDateNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setDate(calendarApi.getDate());
  };

  const handleEventClick = async (event) => {
    event.setExtendedProp('loading', true);
    calendarRef.current.getApi().refetchEvents();

    // try {
    //   const response = await ServiceOrderDetailList(event.id, event.start);
    //   event.setExtendedProp('loading', false);
    //   calendarRef.current.getApi().refetchEvents();

    //   setSelectedEvent({ detalle: response.detalle, infoEvent: event });
    //   setViewModalOpen(true);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <>
      <Card elevation={0}>
        <CardContent>
          <CalendarStyled>
            <Toolbar
              date={date}
              view={calendarView}
              onClickNext={handleDateNext}
              onClickPrev={handleDatePrev}
              onClickToday={handleDateToday}
              onChangeView={handleViewChange}
            />
            <FullCalendar
              locales={[esLocale]}
              weekends
              events={!loadingEvents ? events : []}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={calendarView}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventResizableFromStart
              droppable={true}
              selectable={true}
              eventAllow={(dropInfo) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Ignorar hora
                const dropDate = new Date(dropInfo.start);
                dropDate.setHours(0, 0, 0, 0);
                return dropDate >= today;
              }}
              height="900px"
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
              eventClick={(info) => handleEventClick(info.event)}
            />
          </CalendarStyled>
        </CardContent>
      </Card>
    </>
  );
}
