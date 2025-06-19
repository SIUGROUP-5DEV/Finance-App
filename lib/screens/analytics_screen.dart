import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/transaction_provider.dart';
import '../widgets/bottom_navigation.dart';

class AnalyticsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Analytics'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.green.shade600, Colors.blue.shade600],
            ),
          ),
        ),
      ),
      body: Consumer<TransactionProvider>(
        builder: (context, transactionProvider, child) {
          final balance = transactionProvider.balance;
          final monthlyIncome = transactionProvider.monthlyIncome;
          final monthlyExpenses = transactionProvider.monthlyExpenses;
          final expensesByCategory = transactionProvider.expensesByCategory;

          return SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                // Overview Cards
                Row(
                  children: [
                    Expanded(
                      child: _buildOverviewCard(
                        'Total Spent',
                        '\$${monthlyExpenses.toStringAsFixed(0)}',
                        Icons.trending_up,
                        Colors.red.shade600,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: _buildOverviewCard(
                        'Budget Left',
                        '\$${(2300 - monthlyExpenses).toStringAsFixed(0)}',
                        Icons.track_changes,
                        Colors.green.shade600,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 24),
                
                // Budget Overview
                _buildBudgetOverview(monthlyExpenses, 2300),
                SizedBox(height: 24),
                
                // Category Breakdown
                if (expensesByCategory.isNotEmpty) ...[
                  _buildCategoryBreakdown(expensesByCategory),
                  SizedBox(height: 24),
                ],
                
                // Pie Chart
                if (expensesByCategory.isNotEmpty) _buildPieChart(expensesByCategory),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: BottomNavigation(currentIndex: 1),
    );
  }

  Widget _buildOverviewCard(String title, String amount, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(16),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    amount,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),
              Icon(icon, color: color, size: 32),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetOverview(double spent, double budget) {
    final percentage = (spent / budget * 100).clamp(0, 100);
    
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
              Icon(Icons.monetization_on, size: 20),
              SizedBox(width: 8),
              Text(
                'Budget Overview',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total Budget Usage'),
              Text('${percentage.toStringAsFixed(1)}%'),
            ],
          ),
          SizedBox(height: 8),
          LinearProgressIndicator(
            value: percentage / 100,
            backgroundColor: Colors.grey.shade200,
            valueColor: AlwaysStoppedAnimation<Color>(
              percentage > 90 ? Colors.red : Colors.blue,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryBreakdown(Map<String, double> expensesByCategory) {
    final categories = [
      {'name': 'Food', 'budget': 600.0, 'color': Colors.red.shade500},
      {'name': 'Transport', 'budget': 400.0, 'color': Colors.blue.shade500},
      {'name': 'Entertainment', 'budget': 200.0, 'color': Colors.green.shade500},
      {'name': 'Shopping', 'budget': 300.0, 'color': Colors.purple.shade500},
      {'name': 'Bills', 'budget': 800.0, 'color': Colors.orange.shade500},
    ];

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
          Text(
            'Category Breakdown',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          ...categories.map((category) {
            final spent = expensesByCategory[category['name']] ?? 0.0;
            final budget = category['budget'] as double;
            final percentage = (spent / budget * 100).clamp(0, 100);
            final isOverBudget = percentage > 100;

            return Container(
              margin: EdgeInsets.only(bottom: 16),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: category['color'] as Color,
                              borderRadius: BorderRadius.circular(6),
                            ),
                          ),
                          SizedBox(width: 8),
                          Text(
                            category['name'] as String,
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                          if (isOverBudget) ...[
                            SizedBox(width: 8),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.red,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'Over Budget',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '\$${spent.toStringAsFixed(0)}',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'of \$${budget.toStringAsFixed(0)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: (percentage / 100).clamp(0, 1),
                    backgroundColor: isOverBudget ? Colors.red.shade100 : Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      isOverBudget ? Colors.red : category['color'] as Color,
                    ),
                  ),
                  SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${percentage.toStringAsFixed(1)}% used',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade500,
                        ),
                      ),
                      Text(
                        '\$${(budget - spent).toStringAsFixed(0)} left',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildPieChart(Map<String, double> expensesByCategory) {
    final colors = [
      Colors.red.shade500,
      Colors.blue.shade500,
      Colors.green.shade500,
      Colors.purple.shade500,
      Colors.orange.shade500,
      Colors.teal.shade500,
    ];

    final sections = expensesByCategory.entries.map((entry) {
      final index = expensesByCategory.keys.toList().indexOf(entry.key);
      return PieChartSectionData(
        color: colors[index % colors.length],
        value: entry.value,
        title: '${(entry.value / expensesByCategory.values.reduce((a, b) => a + b) * 100).toStringAsFixed(1)}%',
        radius: 60,
        titleStyle: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      );
    }).toList();

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
          Text(
            'Expense Distribution',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Container(
            height: 200,
            child: PieChart(
              PieChartData(
                sections: sections,
                centerSpaceRadius: 40,
                sectionsSpace: 2,
              ),
            ),
          ),
          SizedBox(height: 16),
          Wrap(
            spacing: 16,
            runSpacing: 8,
            children: expensesByCategory.entries.map((entry) {
              final index = expensesByCategory.keys.toList().indexOf(entry.key);
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: colors[index % colors.length],
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  SizedBox(width: 4),
                  Text(
                    entry.key,
                    style: TextStyle(fontSize: 12),
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}