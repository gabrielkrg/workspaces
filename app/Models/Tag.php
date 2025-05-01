<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name', 'color', 'user_id', 'workspace_id'];

    protected $guarded = [];

    protected $casts = [];

    public function tasks()
    {
        return $this->belongsToMany(Task::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
