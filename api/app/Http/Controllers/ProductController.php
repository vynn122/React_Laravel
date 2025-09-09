<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use function PHPUnit\Framework\isEmpty;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Product::query();
        if ($request->has('category_id')) {
            // $product->where('category_id', "=", $request->category_id);
            $query->where('catgory_id', "=", $request->input('category_id'));
        };
        if ($request->has('brand_id')) {
            $query->where('brand_id', "=", $request->brand_id);
        };
        if ($request->has('txt_search')) {
            $query->where('product_name', 'LIKE', '%' . $request->txt_search . '%');
        }
        // $product = $query->get();  //  get all list product
        $product = $query->with(['category', 'brand'])->get(); // get all list product with relative table

        if ($product->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No product yet',
            ]);
        }

        // $data = Product::with(['category', 'brand'])->get();
        return response()->json([
            'success' => true,
            'message' => 'Product Retreive Successful',
            'data' => $product
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
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_code' => 'required|string|unique:products,product_code',
            'product_name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'price' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'boolean'
        ]);
        // other way when we don't need to declaire variable $validatedData
        // $data = $request->all();
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $validatedData['image'] = $imagePath;

        $product = Product::create($validatedData);
        return response()->json([
            'success' => true,
            'message' => 'Product Created Successfully',
            'data' => $product
        ]);
    }

    /*
        public function store(Request $request)
{
    $validatedData = $request->validate([
        'category_id'   => 'required|exists:categories,id',
        'brand_id'      => 'required|exists:brands,id',
        'product_code'  => 'required|string|unique:products,product_code',
        'product_name'  => 'required|string',
        'description'   => 'nullable|string',
        'quantity'      => 'required|integer',
        'price'         => 'required|numeric',
        'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'status'        => 'boolean'
    ]);

    $imagePath = null;

    try {
        DB::beginTransaction();

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validatedData['image'] = $imagePath;
        }

        $product = Product::create($validatedData);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Product Created Successfully',
            'data' => $product
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();

        // delete uploaded file if insert failed
        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to create product',
            'error'   => $e->getMessage()
        ], 500);
    }
}

    */

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product Not Found',
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Product retrieved successfully',
            'data' => $product->load(['category', 'brand'])
        ]);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product Not Found'
            ]);
        }
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'product_code' => 'sometimes|required|string|unique:products,product_code,' . $id,
            'product_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'sometimes|required|integer',
            'price' => 'sometimes|required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'boolean'

            /*
            'product_code'  => [
            'sometimes',
            'required',
            'string',
            Rule::unique('products', 'product_code')->ignore($id),
        ],
            */
        ]);
        $bodyData = $request->all();
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $bodyData['image'] = $request->file('image')->store('products', 'public');
        }
        $product->update($bodyData);
        return response()->json([
            'success' => true,
            'message' => 'Product Updated Successfully',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product Not Found',
            ]);
        }
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json([
            'success' => true,
            'message' => 'Product Deleted Successfully'
        ]);
    }
}
