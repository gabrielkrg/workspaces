import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import WorkspaceController from './WorkspaceController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
}

export default Settings