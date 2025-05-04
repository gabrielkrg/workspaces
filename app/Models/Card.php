<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $fillable = [
        'title',
        'description',
        'kanban_id',
        'workspace_id',
        'user_id',
        'column_id',
        'order',
    ];

    public function kanban()
    {
        return $this->belongsTo(Kanban::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
