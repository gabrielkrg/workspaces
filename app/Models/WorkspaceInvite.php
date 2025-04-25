<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class WorkspaceInvite extends Model
{
    protected $fillable = ['workspace_id', 'token', 'expires_at'];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function isExpired()
    {
        return now()->greaterThan($this->expires_at);
    }
}
