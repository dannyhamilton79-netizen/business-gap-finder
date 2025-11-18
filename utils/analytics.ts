
export const logEvent = (eventName: string, params: Record<string, any>) => {
  console.log(`[ANALYTICS] Event: ${eventName}`, params);
};

export const view_page = (route: string) => {
  logEvent('view_page', { route });
};

export const click_button = (label: string, route?: string) => {
  logEvent('click_button', { label, route });
};

export const save_state = (key: string) => {
  logEvent('save_state', { key });
};

export const export_doc = (docType: string) => {
  logEvent('export', { docType });
};

export const paywall_view = (context?: any) => {
  logEvent('paywall_view', { context });
};

export const paywall_trigger = (feature: string) => {
  logEvent('paywall_trigger', { feature });
};

export const upgrade_success = (plan: string) => {
  logEvent('upgrade_success', { plan });
};

export const idea_saved = (ideaId: string) => {
  logEvent('idea_saved', { ideaId });
};

export const compute_pricing = () => {
  logEvent('compute_pricing', {});
};

export const create_packages = () => {
  logEvent('create_packages', {});
};

export const send_to_milestones = (source: string) => {
  logEvent('send_to_milestones', { source });
};

export const generate_brand_name = (params: any) => {
  logEvent('generate_brand_name', params);
};

export const generate_logo = (params: any) => {
  logEvent('generate_logo', params);
};

export const generate_voice = (params: any) => {
  logEvent('generate_voice', params);
};

export const generate_posts = (params: any) => {
  logEvent('generate_posts', params);
};

export const generate_projections = () => {
  logEvent('generate_projections', {});
};

export const funding_search = (params: any) => {
  logEvent('funding_search', params);
};

export const generate_persona = (params: any) => {
  logEvent('generate_persona', params);
};

export const generate_marketing_plan = (params: any) => {
  logEvent('generate_marketing_plan', params);
};

export const calculate_roi = (params: any) => {
  logEvent('calculate_roi', params);
};

export const generate_charts = () => {
  logEvent('generate_charts', {});
};

export const search_grants = (params: any) => {
  logEvent('search_grants', params);
};
