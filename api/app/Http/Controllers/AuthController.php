<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    ///register func
    public function register(Request $request)
    {
        $validateData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:5',
            //'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()]

            // for profile
            'phone' => 'nullable',
            'address' => 'nullable',
            'type' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        // $user = User::create([
        //     'name' => $request->name,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password)
        // ]);

        /// create user
        $user = User::create([
            'name' => $validateData['name'],
            'email' => $validateData['email'],
            'password' => Hash::make($validateData['password'])
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('profiles', 'public');
        }

        $user->profile()->create([
            'phone' => $validateData['phone'],
            'address' => $validateData['address'],
            'type' => $validateData['type'],
            'image' => $imagePath
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Account Create Successful',
            'user' => $user,
            'pf_user' => $user->load('profile')
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'error' => 'Incorrect email or password'
            ], 401);
        }
        return response()->json([
            'success' => true,
            'message' => 'Login Successful',
            'token' => $token,
            'user' => JWTAuth::user()->load('profile'),
        ]);
    }
}
