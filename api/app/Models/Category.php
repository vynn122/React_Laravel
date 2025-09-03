<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = ['code', 'name', 'status', 'image'];
    public function products()
    {
        $this->hasMany(Product::class);
    }
}
