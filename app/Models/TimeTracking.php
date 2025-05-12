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
        'duration',
        'is_running',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_running' => 'boolean',
        'duration' => 'integer',
    ];

    protected $appends = [
        'duration_formatted',
    ];

    public function getDurationFormattedAttribute()
    {
        return gmdate('H:i:s', $this->duration);
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
