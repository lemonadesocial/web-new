import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  setAIPageEditTriggers,
  getAIPageEditTriggers,
  type AIPageEditTriggers,
} from '$lib/components/features/page-builder/hooks/ai-page-edit-bridge';

// ---------------------------------------------------------------------------
// Simulate the ai_page_edit handler from InputChat.tsx as a standalone fn
// so we can test the schema guard + warning paths without mounting React.
// ---------------------------------------------------------------------------

/**
 * Extracted handler logic — mirrors the .with('ai_page_edit', ...) block
 * in InputChat.tsx exactly.
 */
async function handleAiPageEdit(toolData: unknown) {
  const triggers = getAIPageEditTriggers();
  if (!triggers) {
    // eslint-disable-next-line no-console
    console.warn('[InputChat] ai_page_edit: no triggers registered (page builder not mounted)');
    return;
  }
  const data = toolData as Record<string, unknown> | undefined;
  if (!data || typeof data !== 'object' || typeof data.action !== 'string') {
    // eslint-disable-next-line no-console
    console.warn('[InputChat] ai_page_edit: invalid payload — missing or malformed "action"', data);
    return;
  }
  const action: string = data.action;
  if (action === 'create') {
    if (!data.input || typeof data.input !== 'object') {
      // eslint-disable-next-line no-console
      console.warn('[InputChat] ai_page_edit/create: missing "input" object', data);
      return;
    }
    await triggers.requestCreate(data.input as Record<string, unknown>);
  } else if (action === 'update_section') {
    if (typeof data.config_id !== 'string' || typeof data.section_id !== 'string' || !data.input || typeof data.input !== 'object') {
      // eslint-disable-next-line no-console
      console.warn('[InputChat] ai_page_edit/update_section: missing config_id, section_id, or input', data);
      return;
    }
    await triggers.requestUpdateSection(
      data.config_id,
      data.section_id,
      data.input as Record<string, unknown>,
    );
  } else if (action === 'generate') {
    if (!data.input || typeof data.input !== 'object') {
      // eslint-disable-next-line no-console
      console.warn('[InputChat] ai_page_edit/generate: missing "input" object', data);
      return;
    }
    await triggers.requestGenerate(data.input as Record<string, unknown>);
  } else {
    // eslint-disable-next-line no-console
    console.warn('[InputChat] ai_page_edit: unknown action', action, data);
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ai_page_edit handler schema guard', () => {
  let triggers: AIPageEditTriggers;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    triggers = {
      requestCreate: vi.fn(),
      requestUpdateSection: vi.fn(),
      requestGenerate: vi.fn(),
    };
    setAIPageEditTriggers(triggers);
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  // ── No triggers ──

  it('warns and returns when no triggers registered', async () => {
    setAIPageEditTriggers(null);
    await handleAiPageEdit({ action: 'create', input: {} });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no triggers registered'));
    expect(triggers.requestCreate).not.toHaveBeenCalled();
  });

  // ── Missing / malformed action ──

  it('warns on null data', async () => {
    await handleAiPageEdit(null);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid payload'), null);
  });

  it('warns on undefined data', async () => {
    await handleAiPageEdit(undefined);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid payload'), undefined);
  });

  it('warns when action is not a string', async () => {
    await handleAiPageEdit({ action: 123 });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid payload'), expect.any(Object));
  });

  it('warns when action is missing entirely', async () => {
    await handleAiPageEdit({ input: {} });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid payload'), expect.any(Object));
  });

  // ── Unknown action ──

  it('warns on unknown action value', async () => {
    await handleAiPageEdit({ action: 'destroy' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown action'), 'destroy', expect.any(Object));
    expect(triggers.requestCreate).not.toHaveBeenCalled();
  });

  // ── create action ──

  it('calls requestCreate with valid create payload', async () => {
    await handleAiPageEdit({ action: 'create', input: { owner_id: 'e1', owner_type: 'event' } });
    expect(triggers.requestCreate).toHaveBeenCalledWith({ owner_id: 'e1', owner_type: 'event' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns when create is missing input', async () => {
    await handleAiPageEdit({ action: 'create' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('create: missing "input"'), expect.any(Object));
    expect(triggers.requestCreate).not.toHaveBeenCalled();
  });

  it('warns when create input is a string instead of object', async () => {
    await handleAiPageEdit({ action: 'create', input: 'bad' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('create: missing "input"'), expect.any(Object));
    expect(triggers.requestCreate).not.toHaveBeenCalled();
  });

  // ── update_section action ──

  it('calls requestUpdateSection with valid payload', async () => {
    await handleAiPageEdit({ action: 'update_section', config_id: 'c1', section_id: 's1', input: { title: 'New' } });
    expect(triggers.requestUpdateSection).toHaveBeenCalledWith('c1', 's1', { title: 'New' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns when update_section is missing config_id', async () => {
    await handleAiPageEdit({ action: 'update_section', section_id: 's1', input: {} });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('update_section: missing'), expect.any(Object));
    expect(triggers.requestUpdateSection).not.toHaveBeenCalled();
  });

  it('warns when update_section is missing section_id', async () => {
    await handleAiPageEdit({ action: 'update_section', config_id: 'c1', input: {} });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('update_section: missing'), expect.any(Object));
    expect(triggers.requestUpdateSection).not.toHaveBeenCalled();
  });

  it('warns when update_section is missing input', async () => {
    await handleAiPageEdit({ action: 'update_section', config_id: 'c1', section_id: 's1' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('update_section: missing'), expect.any(Object));
    expect(triggers.requestUpdateSection).not.toHaveBeenCalled();
  });

  // ── generate action ──

  it('calls requestGenerate with valid payload', async () => {
    await handleAiPageEdit({ action: 'generate', input: { description: 'A cool page' } });
    expect(triggers.requestGenerate).toHaveBeenCalledWith({ description: 'A cool page' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns when generate is missing input', async () => {
    await handleAiPageEdit({ action: 'generate' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('generate: missing "input"'), expect.any(Object));
    expect(triggers.requestGenerate).not.toHaveBeenCalled();
  });
});
