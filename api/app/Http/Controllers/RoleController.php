<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Mockery\Undefined;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // get all roles
        $role = Role::all();
        if ($role->isEmpty()) {
            return response()->json([
                'message' => 'No Roles Found'
            ]);
        }
        /// filter by txt_search 
        if ($request->has('txt_search')) {
            $txt_search = $request->input('txt_search');
            $role = Role::where('name', 'like', "%$txt_search%")
                ->orWhere('code', 'like', "%$txt_search%")
                ->orWhere('description', 'like', "%$txt_search%")
                ->get();
        }
        // filter by status
        if ($request->has('status')) {
            $status = $request->input('status');
            if ($status == 1) {
                $role = Role::where('status', true)->get();
            } elseif ($status == 0) {
                $role = Role::where('status', false)->get();
            }
        }
        return response()->json([
            'success' => true,
            'message' => 'Roles retrieved successfully',
            'data' => $role,
            // 'query' => $request->query(),
            // 'query' => $request->input('txt_search')
        ]);
    }
    // public function index(Request $request)
    // {
    //     $query = Role::query();

    //     // filter by txt_search 
    //     if ($request->filled('txt_search')) {
    //         $txt_search = $request->input('txt_search');
    //         $query->where(function ($q) use ($txt_search) {
    //             $q->where('name', 'like', "%$txt_search%")
    //                 ->orWhere('code', 'like', "%$txt_search%")
    //                 ->orWhere('description', 'like', "%$txt_search%");
    //         });
    //     }

    //     // filter by status
    //     if ($request->has('status')) {
    //         $status = $request->input('status');
    //         if ($status == 1) {
    //             $query->where('status', true);
    //         } elseif ($status == 0) {
    //             $query->where('status', false);
    //         }
    //         // if status is missing/null → do nothing (return all)
    //     }

    //     $roles = $query->get();

    //     if ($roles->isEmpty()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'No Roles Found',
    //             'data' => []
    //         ]);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Roles retrieved successfully',
    //         'data' => $roles
    //     ]);
    // }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);
        $role = Role::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Insert Successful',
            'data' => $role
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role Not Found'
            ]);
        }
        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $id)
    {

        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role Not Found'
            ]);
        }
        $validated = $request->validate([
            'code' => 'sometimes|required|string',
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|boolean',

        ]);
        $role->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Update Successful',
            'data' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role Not Found',
            ]);
        }
        $validated = $request->validate([
            'code' => 'sometimes|required|string',
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|boolean',
        ]);
        $role->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Update Successful',
            'data' => $role
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role Not Found',
            ]);
        }
        $role->delete();
        return response()->json([
            'success' => true,
            'message' => 'Delete Successful',
        ]);
    }
}
