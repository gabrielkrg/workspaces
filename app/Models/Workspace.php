<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'time_zone', 'user_id'];

    protected $guarded = [];

    protected $casts = [];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
    

    public function cards()
    {
        return $this->hasMany(Card::class);
    }

  public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

  
}
