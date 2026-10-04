import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [1440,390,320]) {
  test(`results homepage is readable and accessible at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:1000});
    await page.goto('/');
    await expect(page.getByRole('heading',{name:'Results & upcoming matches'})).toBeVisible();
    await expect(page.getByLabel('Choose competition')).toHaveValue('PL');
    const board=page.locator('section[aria-labelledby="football-board-title"]');
    await expect(board.getByText('0 – 0',{exact:true})).toBeVisible();
    await expect(board.getByText('Result pending',{exact:true}).first()).toBeVisible();
    await expect(board.getByRole('heading',{name:'Today’s matches'})).toBeVisible();
    await expect(board.getByRole('heading',{name:'Latest results'})).toBeVisible();
    await expect(board.getByRole('heading',{name:'Upcoming fixtures'})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect((await new AxeBuilder({page}).include('section[aria-labelledby="football-board-title"]').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
    await page.screenshot({path:`test-results/free-home-${width}.png`,fullPage:true});
  });
}
test('competition dropdown changes results and shows next match when today empty',async({page})=>{
 await page.goto('/');await page.getByLabel('Choose competition').selectOption('CL');
 await expect(page.getByRole('heading',{name:'Next matches',exact:true})).toBeVisible();
 await expect(page.getByText('Test Home 5').first()).toBeVisible();
 await expect(page.getByText('Test Home 2')).toHaveCount(0);
 await page.getByLabel('Choose competition').selectOption('ALL');
 await expect(page.getByText('Test Home 2')).toBeVisible();
});
test('paid endpoints and legacy football surfaces cannot continue live provider work',async({request,page})=>{
 for(const path of ['/api/pl/fixtures','/api/scores','/api/debug/api-football','/en/api/pl/fixtures']) {
  const response=await request.get(path);expect(response.status()).toBe(503);expect(await response.json()).toMatchObject({error:'live_service_paused'});
 }
 await page.goto('/premier-league/fixtures');await expect(page).toHaveURL(/competition=PL/);
 await expect(page.getByRole('heading',{name:'Results & upcoming matches'})).toBeVisible();
});
test('homepage preserves content feeds without live polling',async({page})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/');await expect(page.getByText('0 – 0',{exact:true})).toBeVisible();
 expect(requests.some(u=>/\/api\/(pl|scores|live)\b|v3\.football\.api-sports\.io/.test(u))).toBe(false);
 await page.getByLabel('Choose competition').selectOption('CL');
 expect(requests.some(u=>/\/api\/(pl|scores|live)\b|v3\.football\.api-sports\.io/.test(u))).toBe(false);
});
