<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $category = Category::all();
        if ($category->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => "No data to display"
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => "Get Successful",
            'data' => $category
        ]);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $category = Category::create($validated);
        return response()->json([
            'success' => true,
            'message' => "Category Crate Successful",
            'data' => $category
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => "Cannot Find this Category"
            ]);
        }
        return response()->json([[
            'success' => true,
            'message' => "Get Category",
            'data' => $category
        ]]);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => "Cannot Find this Category"
            ]);
        }
        $validated = $request->validate([
            'code' => 'sometimes|required|string',
            'name' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:active, inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $category->update($validated);
        return response()->json([
            'success' => true,
            'message' => "Category Updated Successful",
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => "Category Not Found"
            ]);
        }
        $category->delete();
        return response()->json([
            'success' => true,
            'message' => "Category Deleted Successful",

        ]);
    }
}
