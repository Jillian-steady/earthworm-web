"use client";

import CustomShortcutDialog from "@/components/layout/CustomShortcutDialog";
import { useAutoNextQuestion } from "@/hooks/useAutoNext";
import { useErrorTip } from "@/hooks/useErrorTip";
import {
  GamePlayMode,
  useGamePlayMode,
} from "@/hooks/useGamePlayMode";
import {
  PronunciationType,
  usePronunciation,
} from "@/hooks/usePronunciation";
import {
  SHORTCUT_KEY_TYPES,
  useShortcutKeyMode,
  parseShortcut,
} from "@/hooks/useShortcutKey";
import {
  useAutoPlayEnglish,
  useAutoPronunciation,
  useKeyboardSound,
} from "@/hooks/useSound";
import { useSpaceSubmitAnswer } from "@/hooks/useSubmitKey";
import { useShowWordsWidth } from "@/hooks/useShowWordsWidth";

const shortcutKeyBindList = [
  { label: "播放发音", type: SHORTCUT_KEY_TYPES.SOUND },
  { label: "显示隐藏/答案预览/再来一次", type: SHORTCUT_KEY_TYPES.ANSWER },
  { label: "返回上个问题", type: SHORTCUT_KEY_TYPES.PREVIOUS },
  { label: "跳过当前问题", type: SHORTCUT_KEY_TYPES.SKIP },
  { label: "标记内容已经掌握", type: SHORTCUT_KEY_TYPES.MASTERED },
  { label: "暂停游戏/继续游戏", type: SHORTCUT_KEY_TYPES.PAUSE },
];

export default function UserSettingPage() {
  const { autoNextQuestion, toggleAutoQuestion } = useAutoNextQuestion();
  const { keyboardSound, toggleKeyboardSound } = useKeyboardSound();
  const { autoPlaySound, toggleAutoPlaySound } = useAutoPronunciation();
  const { autoPlayEnglish, toggleAutoPlayEnglish } = useAutoPlayEnglish();
  const {
    pronunciation,
    getPronunciationOptions,
    togglePronunciation,
  } = usePronunciation();
  const { showWordsWidth, toggleAutoWordsWidth } = useShowWordsWidth();
  const { useSpace, toggleUseSpaceSubmitAnswer } = useSpaceSubmitAnswer();
  const { showErrorTip, toggleShowErrorTip } = useErrorTip();
  const { shortcutKeys, handleEdit } = useShortcutKeyMode();
  const {
    getGamePlayModeOptions,
    currentGamePlayMode,
    toggleGamePlayMode,
  } = useGamePlayMode();

  return (
    <>
      <div className="mx-auto my-8 w-full max-w-screen-lg space-y-8 rounded-lg bg-base-100 px-6 py-8 shadow-even-lg dark:bg-gray-900 dark:shadow-gray-700 md:px-12">
        {/* Game Mode */}
        <section>
          <h2 className="border-b pb-4 text-xl font-medium">游戏模式</h2>
          <table className="table text-base">
            <tbody>
              <tr className="hover">
                <td className="label-text">模式</td>
                <td className="text-right">
                  <div className="join">
                    {getGamePlayModeOptions.map((mode) => (
                      <input
                        key={mode.value}
                        className="btn join-item btn-sm"
                        type="radio"
                        name="gameMode"
                        value={mode.value}
                        aria-label={mode.label}
                        checked={currentGamePlayMode === mode.value}
                        onChange={() =>
                          toggleGamePlayMode(mode.value as GamePlayMode)
                        }
                      />
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Shortcut Keys */}
        <section>
          <h2 className="border-b pb-4 text-xl font-medium">快捷键设置</h2>
          <table className="table text-base">
            <thead>
              <tr className="text-base">
                <th>功能</th>
                <th className="w-1/6 text-center">快捷键</th>
                <th className="w-2/6 pr-6 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {shortcutKeyBindList.map((item) => (
                <tr key={item.type} className="hover">
                  <td className="label-text">{item.label}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-0.5 text-center">
                      {parseShortcut(shortcutKeys[item.type] || "").map(
                        (key, index) => (
                          <kbd key={index} className="kbd kbd-sm">
                            {key}
                          </kbd>
                        ),
                      )}
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-outline btn-secondary btn-sm text-fuchsia-500 outline-fuchsia-500 hover:border-fuchsia-500 hover:bg-fuchsia-500 hover:text-white"
                      onClick={() => handleEdit(item.type)}
                    >
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Sound Settings */}
        <section>
          <h2 className="border-b pb-4 text-xl font-medium">声音设置</h2>
          <table className="table">
            <tbody>
              <tr className="hover">
                <td className="label-text">开启键盘打字音效</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={keyboardSound}
                    onChange={toggleKeyboardSound}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="label-text">答案页面自动播放声音</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={autoPlaySound}
                    onChange={toggleAutoPlaySound}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="label-text">答题时自动播放声音</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={autoPlayEnglish}
                    onChange={toggleAutoPlayEnglish}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="label-text">切换口音</td>
                <td className="text-right">
                  <div className="join">
                    {getPronunciationOptions.map((lang) => (
                      <input
                        key={lang.value}
                        className="btn join-item btn-sm"
                        type="radio"
                        name="options"
                        value={lang.value}
                        aria-label={lang.label}
                        checked={pronunciation === lang.value}
                        onChange={() =>
                          togglePronunciation(lang.value as PronunciationType)
                        }
                      />
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Answer Settings */}
        <section>
          <h2 className="border-b pb-4 text-xl font-medium">答题设置</h2>
          <table className="table">
            <tbody>
              <tr className="hover">
                <td className="label-text">显示每个单词长度</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={showWordsWidth}
                    onChange={toggleAutoWordsWidth}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="label-text">开启空格提交答案</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={useSpace}
                    onChange={toggleUseSpaceSubmitAnswer}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="label-text">答题正确后自动下一题</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={autoNextQuestion}
                    onChange={toggleAutoQuestion}
                  />
                </td>
              </tr>
              <tr className="hover">
                <td className="label-text">自动显示答案（输错三次）</td>
                <td className="text-right">
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={showErrorTip}
                    onChange={toggleShowErrorTip}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
      <CustomShortcutDialog />
    </>
  );
}
