import 'package:flutter/material.dart';
import '../models/transaction.dart';
import '../services/api_service.dart';

class TransactionProvider with ChangeNotifier {
  List<Transaction> _transactions = [];
  bool _isLoading = false;

  List<Transaction> get transactions => _transactions;
  bool get isLoading => _isLoading;

  double get balance {
    return _transactions.fold(0.0, (sum, transaction) {
      return transaction.type == 'income' 
          ? sum + transaction.amount 
          : sum - transaction.amount;
    });
  }

  double get monthlyIncome {
    return _transactions
        .where((t) => t.type == 'income')
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double get monthlyExpenses {
    return _transactions
        .where((t) => t.type == 'expense')
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  Map<String, double> get expensesByCategory {
    final Map<String, double> categoryTotals = {};
    
    for (final transaction in _transactions.where((t) => t.type == 'expense')) {
      categoryTotals[transaction.category] = 
          (categoryTotals[transaction.category] ?? 0) + transaction.amount;
    }
    
    return categoryTotals;
  }

  Future<void> loadTransactions(String token) async {
    _isLoading = true;
    notifyListeners();

    try {
      _transactions = await ApiService.getTransactions(token);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      throw e;
    }
  }

  Future<void> addTransaction(String token, Transaction transaction) async {
    try {
      final newTransaction = await ApiService.createTransaction(token, transaction);
      _transactions.insert(0, newTransaction);
      notifyListeners();
    } catch (e) {
      throw e;
    }
  }

  Future<void> deleteTransaction(String token, String transactionId) async {
    try {
      await ApiService.deleteTransaction(token, transactionId);
      _transactions.removeWhere((t) => t.id == transactionId);
      notifyListeners();
    } catch (e) {
      throw e;
    }
  }
}