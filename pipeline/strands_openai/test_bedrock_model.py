from __future__ import annotations

import unittest
from unittest.mock import patch, MagicMock

from pipeline.strands_openai.run import (
    build_agent,
    build_pegasus_context,
    DEFAULT_MODEL_ID,
    DEFAULT_REGION,
    SYSTEM_PROMPT,
)


class BedrockModelConfigTests(unittest.TestCase):
    def test_build_agent_uses_bedrock_model(self) -> None:
        with patch("pipeline.strands_openai.run.BedrockModel") as mock_cls:
            mock_cls.return_value = MagicMock()
            with patch("pipeline.strands_openai.run.Agent") as mock_agent:
                mock_agent.return_value = MagicMock()
                build_agent(DEFAULT_REGION, DEFAULT_MODEL_ID)

            mock_cls.assert_called_once_with(
                model_id=DEFAULT_MODEL_ID,
                region_name=DEFAULT_REGION,
                max_tokens=2048,
                streaming=False,
            )

    def test_build_agent_includes_pegasus_context(self) -> None:
        with patch("pipeline.strands_openai.run.BedrockModel") as mock_cls:
            mock_cls.return_value = MagicMock()
            with patch("pipeline.strands_openai.run.Agent") as mock_agent:
                mock_agent.return_value = MagicMock()
                build_agent(DEFAULT_REGION, DEFAULT_MODEL_ID, pegasus_context="\nEXTRA")

            call_kwargs = mock_agent.call_args[1]
            self.assertIn("EXTRA", call_kwargs["system_prompt"])

    def test_default_model_id(self) -> None:
        self.assertEqual(DEFAULT_MODEL_ID, "openai.gpt-oss-120b-1:0")

    def test_default_region(self) -> None:
        self.assertEqual(DEFAULT_REGION, "us-east-1")

    def test_build_pegasus_context_empty_for_missing_file(self) -> None:
        from pathlib import Path
        result = build_pegasus_context(Path("/nonexistent/path.json"))
        self.assertEqual(result, "")

    def test_build_pegasus_context_empty_for_none(self) -> None:
        result = build_pegasus_context(None)
        self.assertEqual(result, "")


if __name__ == "__main__":
    unittest.main()
