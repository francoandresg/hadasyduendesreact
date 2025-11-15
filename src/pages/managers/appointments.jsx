import { useEffect, useRef, useState } from 'react';

// Hooks
import useMediaQuery from '@mui/material/useMediaQuery';

// Material UI
import { Card, CardContent, Fab } from '@mui/material';
import { Add } from 'iconsax-reactjs';

// FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

// Components
import CalendarStyled from '../../sections/apps/calendar/CalendarStyled';
import Toolbar from '../../sections/apps/calendar/toolbar';
import ModalAddApointment from '../../components/modal/ModalAddAppointment';

// Utils
import dayjs from 'dayjs';

// Api
import { getSelectorBoxes } from '../../api/managers/appointments';

export default function WidgetAppointments() {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);

  const [boxes, setBoxes] = useState([]);
  const [date, setDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [openNewEventModal, setOpenNewEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = matchDownSM ? 'listWeek' : 'dayGridMonth';
      calendarApi.changeView(newView);
      setCalendarView(newView);
    }
  }, [matchDownSM]);

  useEffect(() => {
    getSelectorBoxes().then((res) => {
      if (res.success) {
        setBoxes(res.data);
      }
    });
  }, []);

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
    // Lógica de vista detalle si la deseas usar
  };

  const openModalNewAppointment = (arg) => {
    const hoy = dayjs().startOf('day');
    const fechaClick = dayjs(arg.date).startOf('day');

    if (fechaClick.isBefore(hoy)) {
      return;
    }

    setSelectedDate(arg.date ?? '');
    setOpenNewEventModal(true);
  };

  const handleSaveEvent = () => {
    console.log('Guardando cita en la fecha:', selectedDate);
    setOpenNewEventModal(false);
  };

  return (
    <>
      <ModalAddApointment
        open={openNewEventModal}
        onClose={() => setOpenNewEventModal(false)}
        boxes={boxes}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />

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
              selectable={false}
              height="900px"
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
              eventClick={(info) => handleEventClick(info.event)}
              dateClick={openModalNewAppointment}
            />
          </CalendarStyled>
        </CardContent>
      </Card>

      <Fab
        color="primary"
        aria-label="add"
        onClick={openModalNewAppointment}
        size="medium"
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32
        }}
      >
        <Add />
      </Fab>
    </>
  );
}
