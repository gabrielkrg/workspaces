<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeTracking extends Model
{
    protected $fillable = [
        'user_id',
        'workspace_id',
        'trackable_id',
        'trackable_type',
        'start_time',
        'end_time',
        'is_running',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    protected $appends = [
        'formatted_start_time',
        'formatted_end_time',
    ];

    public static $types = [
        [
        'label' => 'Ticket',
        'model' => 'App\\Models\\Ticket',
        ],
        [
            'label' => 'Task',
            'model' => 'App\\Models\\Task',
        ],
        [
            'label' => 'Card',
            'model' => 'App\\Models\\Card',
        ],
    ];

    public function getFormattedStartTimeAttribute()
    {
        return $this->start_time->format('Y-m-d H:i:s');
    }

    public function getFormattedEndTimeAttribute()
    {
        return $this->end_time->format('Y-m-d H:i:s');
    }

    public function trackable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
