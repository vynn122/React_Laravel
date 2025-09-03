<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use function PHPUnit\Framework\isEmpty;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $brand = Brand::all();
        if ($brand->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => "No Brands Found"
            ]);
        }
        return response()->json([
            'success' => true,
            'data' => $brand,
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
            'code' => 'required|string|max:255|unique:brands',
            'name' => 'required|string|max:255',
            'from_country' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:active,inactive',
        ]);
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('brands', 'public');
        }

        $validated['image'] = $imagePath ?? null;

        $brand = Brand::create($validated);
        return response()->json([
            'success' => true,
            'message' => "Brand Created Successfully",
            'data' => $brand,
            'validated' => $validated
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand Not Found'
            ]);
        }
        return response()->json([
            'success' => true,
            'data' => $brand
        ]);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand Not Found'
            ]);
        }
        $validated = $request->validate([
            'code' => 'sometimes|required|string|max:255|unique:brands,code,' . $id,
            'name' => 'sometimes|required|string|max:255',
            'from_country' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'sometimes|required|in:active,inactive',
            'image_remove' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            if ($brand->image) {
                //if image exist delete old image
                Storage::disk('public')->delete($brand->image);
            }
            $imagePath = $request->file('image')->store('brands', 'public');
            $validated['image'] = $imagePath;
        }
        if ($request->image_remove != null) {
            Storage::disk('public')->delete($request->image_remove);
            $brand->image = null;
        }

        $brand->update($validated);
        return response()->json([
            'meess' => $brand->image_remove,
            'image_remove' => $request->image_remove,
            'success' => true,
            'message' => "Brand Updated Successfully",
            'data' => $brand,
            'validated' => $validated
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json([
                'success' => true,
                'message' => "Brand Not Found!"
            ]);
        }
        if ($brand->image) {
            //if image exist delete old image
            Storage::disk('public')->delete($brand->image);
        }
        $brand->delete();
        return response()->json([
            'success' => true,
            'message' => "Brand Deleted Successfully!"
        ]);
    }
}
