<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;
    protected $fillable = ['code', 'name', 'from_country', 'image', 'status'];
    /// one brand has many product
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
