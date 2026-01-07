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
        'elapsed_time',
    ];

    public static $types = [
        [
            'label' => 'Card',
            'model' => 'App\\Models\\Card',
        ],
        [
            'label' => 'Task',
            'model' => 'App\\Models\\Task',
        ],
        [
            'label' => 'Ticket',
            'model' => 'App\\Models\\Ticket',
        ],
    ];

    public function getFormattedStartTimeAttribute()
    {
        return $this->start_time->format('d/m/Y - H:i');
    }

    public function getFormattedEndTimeAttribute()
    {
        return $this->end_time ? $this->end_time->format('d/m/Y - H:i') : null;
    }

    public function getElapsedTimeAttribute(): int
    {
        if (!$this->start_time) {
            return 0;
        }

        $end = $this->is_running ? now() : $this->end_time;

        if (!$end) {
            return 0;
        }

        return $this->start_time->diffInSeconds($end);
    }

    public function trackable()
    {
        return $this->morphTo();
    }

    public function client()
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
