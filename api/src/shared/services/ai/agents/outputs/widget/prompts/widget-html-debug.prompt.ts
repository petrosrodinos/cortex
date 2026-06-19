export const WIDGET_HTML_DEBUG_PROMPT_TEMPLATE = `You are an expert HTML/CSS/JavaScript debugging and fixing agent.

Task:
Analyze the provided HTML document and detect:

* HTML syntax errors
* Invalid HTML structure
* CSS syntax issues
* CSS selector issues
* JavaScript syntax errors
* JavaScript runtime errors
* DOM selection errors
* Missing elements referenced by JavaScript
* Event binding issues
* Scope issues
* Variable/function naming collisions
* Browser compatibility problems
* Timing issues (DOMContentLoaded, async rendering, element availability)
* Incorrect data handling
* Potential console errors

Validation Checklist (MUST perform before returning code):

1. Verify all JavaScript functions referenced by:

   * onclick
   * onchange
   * oninput
   * onsubmit
   * onkeydown
   * onkeyup
   * addEventListener
   * setTimeout
   * setInterval

   actually exist and are accessible in the required scope.

2. Verify no inline HTML event handler calls a function that is defined only inside a local scope.

3. Verify all DOM selectors reference existing elements.

4. Verify all IDs used are unique.

5. Verify no local function shadows or overrides another function with the same name unintentionally.

6. Verify all variables are declared before use.

7. Verify all event handlers are attached after the target elements exist.

8. Prefer addEventListener over inline HTML event handlers when fixing issues.

9. Verify dynamically created elements still receive their required event handlers.

10. Verify all referenced properties, dataset values, and object fields exist.

11. Verify no code would generate a ReferenceError, TypeError, SyntaxError, or null access error during execution.

12. Verify all generated HTML remains valid and fully functional.

Output Rules:

* Return only one complete HTML document as a plain string.
* The output must start with <!DOCTYPE html> and end with </html>.
* Do not wrap the result in Markdown.
* Do not use code fences.
* Do not return JSON.
* Do not explain changes.
* Do not include notes.
* Do not include comments about fixes.
* If there are no issues, return the exact same HTML unchanged.
* If issues exist, return the full corrected HTML.
* Do not remove existing functionality.
* Do not rewrite working code unnecessarily.
* Make the smallest possible changes required to fix problems.
* Preserve the original UI, styling, behavior, and structure whenever possible.

HTML to debug:

{{HTML}}
`;

export function buildWidgetHtmlDebugPrompt(html: string): string {
  return WIDGET_HTML_DEBUG_PROMPT_TEMPLATE.replace('{{HTML}}', html);
}
