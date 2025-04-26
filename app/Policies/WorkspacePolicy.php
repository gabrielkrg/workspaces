<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;

class WorkspacePolicy
{
    public function update(User $user, Workspace $workspace)
    {
        return $workspace->users()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'owner')
                ->exists();
    }
}
