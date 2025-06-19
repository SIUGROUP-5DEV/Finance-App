import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/bottom_navigation.dart';

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _isEditingProfile = false;
  final _nameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    _nameController.text = user?.name ?? '';
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _handleLogout() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.logout();
    Navigator.of(context).pushReplacementNamed('/auth');
  }

  Future<void> _updateName() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final user = authProvider.user;
    
    if (user != null && _nameController.text.trim().isNotEmpty) {
      try {
        final updatedUser = User(
          id: user.id,
          name: _nameController.text.trim(),
          email: user.email,
          profileImage: user.profileImage,
        );
        
        await authProvider.updateProfile(updatedUser);
        setState(() {
          _isEditingProfile = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Profile updated successfully')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update profile: ${e.toString()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;
          
          return SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                // Profile Section
                _buildSection(
                  'Profile',
                  Icons.edit,
                  [
                    // Profile Image
                    Center(
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 48,
                            backgroundColor: Colors.grey.shade300,
                            child: Icon(
                              Icons.person,
                              size: 48,
                              color: Colors.grey.shade600,
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.blue,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Icon(
                                Icons.camera_alt,
                                size: 16,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 24),
                    // Name Field
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Full Name',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey.shade700,
                                ),
                              ),
                              SizedBox(height: 4),
                              _isEditingProfile
                                  ? TextField(
                                      controller: _nameController,
                                      decoration: InputDecoration(
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 8,
                                        ),
                                      ),
                                    )
                                  : Text(
                                      user?.name ?? 'User',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                            ],
                          ),
                        ),
                        SizedBox(width: 16),
                        _isEditingProfile
                            ? Row(
                                children: [
                                  ElevatedButton(
                                    onPressed: _updateName,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue,
                                      foregroundColor: Colors.white,
                                      minimumSize: Size(60, 36),
                                    ),
                                    child: Text('Save', style: TextStyle(fontSize: 12)),
                                  ),
                                  SizedBox(width: 8),
                                  OutlinedButton(
                                    onPressed: () {
                                      setState(() {
                                        _isEditingProfile = false;
                                        _nameController.text = user?.name ?? '';
                                      });
                                    },
                                    style: OutlinedButton.styleFrom(
                                      minimumSize: Size(60, 36),
                                    ),
                                    child: Text('Cancel', style: TextStyle(fontSize: 12)),
                                  ),
                                ],
                              )
                            : OutlinedButton.icon(
                                onPressed: () {
                                  setState(() {
                                    _isEditingProfile = true;
                                  });
                                },
                                icon: Icon(Icons.edit, size: 16),
                                label: Text('Edit', style: TextStyle(fontSize: 12)),
                                style: OutlinedButton.styleFrom(
                                  minimumSize: Size(60, 36),
                                ),
                              ),
                      ],
                    ),
                    SizedBox(height: 16),
                    // Email Field
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Email',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey.shade700,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          user?.email ?? 'user@example.com',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: 24),
                
                // Notifications
                _buildSection(
                  'Notifications',
                  Icons.notifications,
                  [
                    _buildSwitchTile('Push Notifications', true),
                    _buildSwitchTile('Budget Alerts', true),
                    _buildSwitchTile('Transaction Alerts', false),
                  ],
                ),
                SizedBox(height: 24),
                
                // Security
                _buildSection(
                  'Security',
                  Icons.security,
                  [
                    _buildSwitchTile('Biometric Login', true),
                    _buildSwitchTile('Two-Factor Authentication', false),
                    _buildListTile('Change Password', Icons.chevron_right),
                  ],
                ),
                SizedBox(height: 24),
                
                // Preferences
                _buildSection(
                  'Preferences',
                  Icons.palette,
                  [
                    _buildSwitchTile('Dark Mode', false),
                    _buildListTile('Currency Settings', Icons.chevron_right),
                    _buildListTile('Language', Icons.chevron_right),
                  ],
                ),
                SizedBox(height: 24),
                
                // Data & Privacy
                _buildSection(
                  'Data & Privacy',
                  Icons.privacy_tip,
                  [
                    _buildListTile('Export Data', Icons.download),
                    _buildListTile('Privacy Policy', Icons.chevron_right),
                    _buildListTile('Terms of Service', Icons.chevron_right),
                  ],
                ),
                SizedBox(height: 24),
                
                // Support
                _buildSection(
                  'Support',
                  Icons.help,
                  [
                    _buildListTile('Help Center', Icons.help_outline),
                    _buildListTile('Contact Support', Icons.chevron_right),
                  ],
                ),
                SizedBox(height: 24),
                
                // Logout
                Container(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _handleLogout,
                    icon: Icon(Icons.logout),
                    label: Text('Sign Out'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: BottomNavigation(currentIndex: 3),
    );
  }

  Widget _buildSection(String title, IconData icon, List<Widget> children) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20),
              SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildSwitchTile(String title, bool value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 16),
          ),
          Switch(
            value: value,
            onChanged: (newValue) {
              // Handle switch change
            },
          ),
        ],
      ),
    );
  }

  Widget _buildListTile(String title, IconData trailingIcon) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 16),
          ),
          Icon(trailingIcon, color: Colors.grey.shade600),
        ],
      ),
    );
  }
}