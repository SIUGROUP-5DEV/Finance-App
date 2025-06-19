import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null && _user != null;

  Future<void> loadStoredAuth() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    final userJson = prefs.getString('user');
    
    if (_token != null && userJson != null) {
      _user = User.fromJson(Map<String, dynamic>.from(
        Map.from(userJson.split(',').asMap().map((i, v) => MapEntry(
          ['id', 'name', 'email', 'profileImage'][i], 
          v
        )))
      ));
      notifyListeners();
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.register(name, email, password);
      _token = response['token'];
      _user = User.fromJson(response['user']);
      
      await _saveAuthData();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw e;
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.login(email, password);
      _token = response['token'];
      _user = User.fromJson(response['user']);
      
      await _saveAuthData();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw e;
    }
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
    
    notifyListeners();
  }

  Future<void> updateProfile(User updatedUser) async {
    if (_token == null) return;

    try {
      _user = await ApiService.updateProfile(_token!, updatedUser);
      await _saveAuthData();
      notifyListeners();
    } catch (e) {
      throw e;
    }
  }

  Future<void> _saveAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    if (_token != null) {
      await prefs.setString('token', _token!);
    }
    if (_user != null) {
      await prefs.setString('user', '${_user!.id},${_user!.name},${_user!.email},${_user!.profileImage ?? ''}');
    }
  }
}