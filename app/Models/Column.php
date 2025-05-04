<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    protected $fillable = [
        'name',
        'kanban_id',
        'order',
    ];
    
    public function kanban()
    {
        return $this->belongsTo(Kanban::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
