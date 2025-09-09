<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'brand_id',
        'product_code',
        'product_name',
        'description',
        'quantity',
        'price',
        'image',
        'status',
    ];

    // one product belong to one category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    // one product belong to one brand

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
