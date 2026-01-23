import Api from './Api'
import AiController from './AiController'
import DashboardController from './DashboardController'
import TaskController from './TaskController'
import TagController from './TagController'
import TicketController from './TicketController'
import ClientController from './ClientController'
import TimeTrackingController from './TimeTrackingController'
import KanbanController from './KanbanController'
import ColumnController from './ColumnController'
import CardController from './CardController'
import NoteController from './NoteController'
import Settings from './Settings'
import Auth from './Auth'

const Controllers = {
    Api: Object.assign(Api, Api),
    AiController: Object.assign(AiController, AiController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    TaskController: Object.assign(TaskController, TaskController),
    TagController: Object.assign(TagController, TagController),
    TicketController: Object.assign(TicketController, TicketController),
    ClientController: Object.assign(ClientController, ClientController),
    TimeTrackingController: Object.assign(TimeTrackingController, TimeTrackingController),
    KanbanController: Object.assign(KanbanController, KanbanController),
    ColumnController: Object.assign(ColumnController, ColumnController),
    CardController: Object.assign(CardController, CardController),
    NoteController: Object.assign(NoteController, NoteController),
    Settings: Object.assign(Settings, Settings),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers