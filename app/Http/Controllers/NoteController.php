<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    //
    public function index()
    {
       return Inertia::render('Note/Index');
    }
}
