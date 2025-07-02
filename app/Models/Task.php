<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Laravel\Sanctum\HasApiTokens;



class Task extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'title', 'description', 'repeat', 'highlight', 'done', 'delete_after', 'user_id', 'workspace_id', 'client_id', 'kanban_id'
    ];

    protected $guarded = [];

    protected $casts = [
        'done' => 'boolean',
        'delete_after' => 'boolean',
        'highlight' => 'boolean',
    ];

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
