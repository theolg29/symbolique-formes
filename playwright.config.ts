import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir:'./tests', fullyParallel:true,
  use:{baseURL:'http://localhost:5173',browserName:'chromium',viewport:{width:1440,height:1000},screenshot:'only-on-failure'},
  webServer:{command:'npm run dev -- --port 5173',url:'http://localhost:5173',reuseExistingServer:true},
})
