import { Page, Route } from '@playwright/test';

type GraphQLMock = {
  data?: unknown;
  errors?: Array<{ message: string }>;
};

type GraphQLMocks = Record<string, GraphQLMock>;

/**
 * Intercept all GraphQL requests and return mock responses based on operationName.
 * Unmatched operations are fulfilled with an empty data response.
 */
export async function mockGraphQL(page: Page, mocks: GraphQLMocks) {
  await page.route('**/graphql', async (route: Route) => {
    const postData = route.request().postData();
    if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

    let body: { operationName?: string };
    try {
      body = JSON.parse(postData);
    } catch {
      return route.continue();
    }

    const operationName = body.operationName;
    if (operationName && mocks[operationName]) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mocks[operationName]),
      });
    }

    // Return empty data for unmatched operations so pages don't hang
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: {} }),
    });
  });
}

/**
 * Capture the variables of a specific GraphQL mutation when it fires.
 * Resolves with the variables object. Also returns mock data so the UI proceeds.
 */
export function waitForMutation(
  page: Page,
  operationName: string,
  responseData: unknown = {}
): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    page.route('**/graphql', async (route: Route) => {
      const postData = route.request().postData();
      if (!postData) return route.continue();

      let body: { operationName?: string; variables?: Record<string, unknown> };
      try {
        body = JSON.parse(postData);
      } catch {
        return route.continue();
      }

      if (body.operationName === operationName) {
        resolve(body.variables ?? {});
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: responseData }),
        });
      }

      return route.continue();
    });
  });
}

/**
 * Capture all GraphQL operations fired during an action.
 * Returns an array of { operationName, variables } in order.
 */
export async function captureGraphQLCalls(
  page: Page,
  action: () => Promise<void>
): Promise<Array<{ operationName: string; variables: Record<string, unknown> }>> {
  const captured: Array<{ operationName: string; variables: Record<string, unknown> }> = [];

  const handler = async (route: Route) => {
    const postData = route.request().postData();
    if (postData) {
      try {
        const body = JSON.parse(postData);
        if (body.operationName) {
          captured.push({
            operationName: body.operationName,
            variables: body.variables ?? {},
          });
        }
      } catch {
        // ignore parse errors
      }
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: {} }),
    });
  };

  await page.route('**/graphql', handler);
  await action();
  await page.unroute('**/graphql', handler);

  return captured;
}
