import WorkspaceController from './WorkspaceController'
import TaskController from './TaskController'
import TimeTrackingController from './TimeTrackingController'
import TagController from './TagController'

const Api = {
    WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
    TaskController: Object.assign(TaskController, TaskController),
    TimeTrackingController: Object.assign(TimeTrackingController, TimeTrackingController),
    TagController: Object.assign(TagController, TagController),
}

export default Api