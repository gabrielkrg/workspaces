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
                ->wherePivotIn('role', ['owner', 'editor'])
                ->exists();
    }

    public function view(User $user, Workspace $workspace)
    {
        return $workspace->users()
                ->where('user_id', $user->id)
                ->exists();
    }

    public function delete(User $user, Workspace $workspace)
    {
        return $workspace->users()
                ->where('user_id', $user->id)
                ->wherePivotIn('role', ['owner'])
                ->exists();
    }
}