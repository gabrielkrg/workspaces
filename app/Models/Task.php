<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;



class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'repeat',
        'highlight',
        'done',
        'delete_after',
        'user_id',
        'workspace_id',
        'client_id',
        'kanban_id'
    ];

    protected $guarded = [];

    protected $casts = [
        'done' => 'boolean',
        'delete_after' => 'boolean',
        'highlight' => 'boolean',
    ];

    protected $appends = [
        'updated_at_formatted',
    ];

    public function getUpdatedAtFormattedAttribute()
    {
        return $this->updated_at->format('d/m/Y - H:i');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
