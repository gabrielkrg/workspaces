<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Kanban extends Model
{
    protected $fillable = [
        'name',
        'workspace_id',
        'user_id',
    ];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function columns()
    {
        return $this->hasMany(Column::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
