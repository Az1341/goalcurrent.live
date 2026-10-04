import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/free-football',workers:1,timeout:90000,retries:process.env.CI?1:0,
  use:{baseURL:'http://127.0.0.1:4878',screenshot:'only-on-failure'},
  webServer:{command:'npm run dev -- --webpack --hostname 127.0.0.1 --port 4878',url:'http://127.0.0.1:4878',timeout:180000,reuseExistingServer:false,env:{CI:'true',GC_FREE_TEST_DATA:'1',NEXT_TELEMETRY_DISABLED:'1'}},
});
