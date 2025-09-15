---
id: troubleshooting-performance
title: Performance Troubleshooting Guide
sidebar_label: Performance Issues
description: Common performance issues and optimization strategies for Keploy CLI operations
tags:
  - troubleshooting
  - performance
  - optimization
  - cli
keywords:
  - keploy performance
  - slow sanitization
  - large test sets
  - optimization
---

# Performance Troubleshooting Guide

This guide addresses common performance issues when working with Keploy CLI commands, especially when dealing with large test suites.

## Common Performance Issues

### 🐌 Slow Secret Sanitization

**Issue**: Secret sanitization becomes slow when processing large numbers of test cases (100+ tests).

**Symptoms**:
- `keploy sanitize` command takes several minutes to complete
- High CPU usage during sanitization process
- Apparent hanging during processing

**Solutions**:

#### 1. Batch Processing
```bash
# Instead of sanitizing all at once
keploy sanitize -p "./keploy-tests"

# Process in smaller batches
keploy sanitize -t "test-set-1,test-set-2,test-set-3" -p "./keploy-tests"
keploy sanitize -t "test-set-4,test-set-5,test-set-6" -p "./keploy-tests"
```

#### 2. Targeted Sanitization
```bash
# Only sanitize test sets that contain secrets
keploy sanitize -t "auth-tests,payment-tests,api-key-tests" -p "./keploy-tests"
```

#### 3. Parallel Processing
```bash
# Run multiple sanitization processes in parallel (different terminals)
# Terminal 1:
keploy sanitize -t "test-set-1,test-set-2" -p "./keploy-tests"

# Terminal 2:
keploy sanitize -t "test-set-3,test-set-4" -p "./keploy-tests"
```

### 🐌 Slow Test Execution

**Issue**: Running large numbers of test cases takes excessive time.

**Solutions**:

#### 1. Selective Test Execution
```bash
# Run specific test sets instead of all tests
keploy test -c "your-app-command" -t "critical-tests,smoke-tests"
```

#### 2. Optimize Test Environment
```bash
# Increase API timeout for complex operations
keploy test -c "your-app-command" --api-timeout 30

# Use delay to manage timing issues
keploy test -c "your-app-command" --delay 2
```

### 🐌 Large Mock File Generation

**Issue**: Mock generation for complex APIs becomes slow.

**Solutions**:

#### 1. Incremental Recording
```bash
# Record in smaller sessions
keploy record -c "your-app-command" -t "test-set-1"
```

#### 2. Remove Unused Mocks
```bash
# Clean up during test runs
keploy test -c "your-app-command" --remove-unused-mocks
```

## Performance Optimization Strategies

### 📊 System Resource Management

#### Monitor Resource Usage
```bash
# Check system resources during operations
top -p $(pgrep keploy)
htop
```

#### Optimize System Settings
- Ensure adequate RAM (minimum 8GB recommended for large test suites)
- Use SSD storage for faster I/O operations
- Close unnecessary applications during large operations

### 🗂️ Test Set Organization

#### Best Practices
1. **Logical Grouping**: Organize tests into logical groups based on functionality
2. **Size Management**: Keep test sets under 50 test cases for optimal performance
3. **Secret Distribution**: Separate tests with secrets from those without

#### Example Structure
```
keploy-tests/
├── auth-tests/           # Contains secrets, needs sanitization
├── public-api-tests/     # No secrets, skip sanitization
├── integration-tests/    # Mixed, selective sanitization
└── smoke-tests/          # Quick tests for CI/CD
```

### ⚡ Command-Specific Optimizations

#### Record Command
```bash
# Use specific paths to reduce processing
keploy record -c "app" -p "./specific-test-dir" 

# Limit recording duration for large applications
timeout 300 keploy record -c "app"  # 5-minute limit
```

#### Test Command
```bash
# Skip coverage for faster execution
keploy test -c "app" --skip-coverage

# Use parallel execution flags when available
keploy test -c "app" --parallel
```

#### Sanitize Command
```bash
# Process only test sets with known secrets
keploy sanitize -t "$(ls keploy-tests/ | grep -E 'auth|secret|token')" -p "./keploy-tests"
```

## Troubleshooting Checklist

When experiencing performance issues:

- [ ] **Check test set sizes** - Are individual test sets too large?
- [ ] **Monitor system resources** - CPU, memory, and disk usage
- [ ] **Review command flags** - Using optimal flags for your use case?
- [ ] **Verify test organization** - Logical grouping and appropriate sizes?
- [ ] **Check for unnecessary operations** - Processing only what's needed?
- [ ] **Consider batch processing** - Breaking large operations into smaller chunks?

## Reporting Performance Issues

If you continue to experience performance issues after following this guide:

1. **Gather Information**:
   - Number of test cases
   - Test set sizes
   - System specifications
   - Command used and flags
   - Time taken vs expected time

2. **Create Reproducible Example**:
   - Use the [flask-secret sample](https://github.com/keploy/samples-python/tree/main/flask-secret)
   - Record 100+ test cases
   - Document the exact commands used

3. **Report the Issue**:
   - Include system information (`uname -a`)
   - Provide performance logs
   - Share test case structure (without sensitive data)

## Related Resources

- [CLI Commands Reference](./cli-commands.md#sanitize)
- [Configuration File](./configuration-file.md)
- [Best Practices for API Testing](./best-practices-api-testing.md)