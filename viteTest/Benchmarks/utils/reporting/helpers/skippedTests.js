// Helper for skipped tests note
export function generateSkippedTestsNote(allResults) {
  const runAllTests = allResults.runAllTests;
  if (runAllTests === false) {
    return `
      <div class="skipped-tests-note" style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 12px; margin: 20px 0;">
        <p><strong>⚠️ Note:</strong> "All" tests were skipped. Run the benchmark again and answer "yes" to include them.</p>
      </div>
    `;
  }
  return "";
}

