import { WarcraftLogsRaidCdAnalysisPage } from './app.po';

describe('warcraft-logs-raid-cd-analysis App', () => {
  let page: WarcraftLogsRaidCdAnalysisPage;

  beforeEach(() => {
    page = new WarcraftLogsRaidCdAnalysisPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
