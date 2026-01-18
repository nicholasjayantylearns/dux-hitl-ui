/**
 * GitOps Timeout Manager
 * Infrastructure-as-Code approach to performance-aware testing
 * 
 * Handles dynamic timeout calculation based on:
 * - Environment characteristics
 * - Real-world performance measurements
 * - System load detection
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

class TimeoutManager {
  constructor() {
    this.config = this.loadConfig();
    this.environment = this.detectEnvironment();
    this.performanceProfile = this.loadPerformanceProfile();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'timeout-strategy.yaml');
      const yamlContent = fs.readFileSync(configPath, 'utf8');
      return yaml.load(yamlContent);
    } catch (error) {
      console.warn('Timeout config not found, using defaults');
      return this.getDefaultConfig();
    }
  }

  detectEnvironment() {
    if (process.env.CI) return 'ci_cd';
    if (process.env.NODE_ENV === 'production') return 'production';
    return 'development';
  }

  loadPerformanceProfile() {
    const envConfig = this.config.environments[this.environment];
    
    // Apply scaling factors based on detected conditions
    let scalingFactor = 1.0;
    
    if (this.isSlowMachine()) {
      scalingFactor *= this.config.scaling_factors.slow_machine_multiplier;
    }
    
    if (this.environment === 'ci_cd') {
      scalingFactor *= this.config.scaling_factors.ci_environment_multiplier;
    }
    
    if (this.isHighLoad()) {
      scalingFactor *= this.config.scaling_factors.high_load_multiplier;
    }

    return {
      ...envConfig,
      scalingFactor,
      calculatedTimeouts: this.calculateTimeouts(envConfig, scalingFactor)
    };
  }

  calculateTimeouts(envConfig, scalingFactor = 1.0) {
    const formulas = this.config.timeout_formulas;
    const calculated = {};
    
    for (const [name, formula] of Object.entries(formulas)) {
      // Simple formula evaluation - in production, use a proper expression parser
      let timeout = this.evaluateFormula(formula, envConfig);
      timeout = Math.round(timeout * scalingFactor);
      calculated[name] = timeout;
    }
    
    return calculated;
  }

  evaluateFormula(formula, envConfig) {
    // Replace variables in formula with actual values
    let expression = formula;
    for (const [key, value] of Object.entries(envConfig)) {
      expression = expression.replace(new RegExp(key, 'g'), value.toString());
    }
    
    // Basic arithmetic evaluation (in production, use safer expression parser)
    try {
      return Function('"use strict"; return (' + expression + ')')();
    } catch (error) {
      console.warn(`Formula evaluation failed for: ${formula}`);
      return 25000; // Safe fallback
    }
  }

  // Dynamic timeout getters
  getBDDGlobalTimeout() {
    return this.performanceProfile.calculatedTimeouts.bdd_global;
  }

  getDoclingTimeout() {
    return this.performanceProfile.calculatedTimeouts.docling_operation;
  }

  getUIInteractionTimeout() {
    return this.performanceProfile.calculatedTimeouts.ui_interaction;
  }

  getAPICallTimeout() {
    return this.performanceProfile.calculatedTimeouts.api_call;
  }

  getDashboardUpdateTimeout() {
    return this.performanceProfile.calculatedTimeouts.dashboard_update;
  }

  // Port discovery with health checks
  async discoverPort(basePort = null) {
    const startPort = basePort || this.config.port_discovery.base_port;
    const maxRetries = this.config.port_discovery.max_retries;
    
    for (let i = 0; i < maxRetries; i++) {
      const port = startPort + i;
      if (await this.isPortHealthy(port)) {
        return port;
      }
    }
    
    throw new Error(`No healthy port found in range ${startPort}-${startPort + maxRetries}`);
  }

  async isPortHealthy(port) {
    const fetch = (await import('node-fetch')).default;
    const timeout = this.config.port_discovery.health_check_timeout;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`http://localhost:${port}/api/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // System performance detection
  isSlowMachine() {
    // Simple heuristic - in production, use more sophisticated detection
    const totalMem = require('os').totalmem();
    const cpuCount = require('os').cpus().length;
    
    return totalMem < 8 * 1024 * 1024 * 1024 || cpuCount < 4; // Less than 8GB RAM or 4 cores
  }

  isHighLoad() {
    // Check if system is under high load
    const loadAvg = require('os').loadavg()[0];
    const cpuCount = require('os').cpus().length;
    
    return loadAvg > cpuCount * 0.8; // Load average > 80% of CPU count
  }

  getDefaultConfig() {
    return {
      environments: {
        development: {
          docling_processing_base: 14000,
          network_buffer: 3000,
          ui_interaction_buffer: 2000
        }
      },
      timeout_formulas: {
        bdd_global: "docling_processing_base + network_buffer + ui_interaction_buffer + 5000",
        docling_operation: "docling_processing_base + network_buffer"
      },
      scaling_factors: {
        slow_machine_multiplier: 1.5,
        ci_environment_multiplier: 1.25,
        high_load_multiplier: 2.0
      }
    };
  }

  // Debugging and monitoring
  getPerformanceReport() {
    return {
      environment: this.environment,
      scalingFactor: this.performanceProfile.scalingFactor,
      calculatedTimeouts: this.performanceProfile.calculatedTimeouts,
      systemInfo: {
        isSlowMachine: this.isSlowMachine(),
        isHighLoad: this.isHighLoad(),
        totalMemory: require('os').totalmem(),
        cpuCount: require('os').cpus().length,
        loadAverage: require('os').loadavg()
      }
    };
  }
}

module.exports = TimeoutManager;