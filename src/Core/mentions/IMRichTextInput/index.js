import React, { useState, useEffect, useRef } from 'react';
import { Text, Platform } from 'react-native';
import CustomTextInput from './CustomTextInput';
import EU from './EditorUtils';
import { mentionStyle } from './styles';

function IMRichTextInput(props) {
  const hasTrackingStarted = useRef(false);
  const previousChar = useRef(' ');
  const trigger = useRef('@');
  const menIndex = useRef(0);
  const triggerLocation = useRef('anywhere'); //'new-words-only', //"anywhere"
  const mentionsMap = useRef(new Map());
  let msg = '';
  let formattedMsg = '';
  if (props.initialValue && props.initialValue !== '') {
    const { map, newValue } = EU.getMentionsWithInputText(props.initialValue);
    mentionsMap.current = map;
    msg = newValue;
    formattedMsg = formatText(newValue);
    setTimeout(() => {
      sendMessageToFooter(newValue);
    });
  }
  const inputTextCopy = useRef(msg);

  const [clearInput, setClearInput] = useState(props.clearInput);
  const [inputText, setInputText] = useState(msg);
  const [formattedText, setFormattedText] = useState(formattedMsg);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });
  const [editorHeight, setEditorHeight] = useState(72);
  const [placeholder, setPlaceholder] = useState(props.placeholder);
  const [isTrackingStarted, setIsTrackingStarted] = useState(false);
  const [showMentions, setShowMentions] = useState(props.showMentions);

  useEffect(() => {
    if (props.clearInput !== clearInput) {
      setClearInput(props.clearInput);
      return;
    }

    if (props.showMentions && !showMentions) {
      const newInputText = `${inputText}${trigger.current}`;
      setInputText(newInputText);
      setShowMentions(props.showMentions);
      return;
    }

    if (!props.showMentions) {
      setShowMentions(props.showMentions);
      return;
    }
  }, [props.clearInput, clearInput, props.showMentions]);

  useEffect(() => {
    if (inputText !== '' && clearInput) {
      setInputText('');
      inputTextCopy.current = '';
      setFormattedText('');

      mentionsMap.current.clear();
    }
  }, [inputText, clearInput]);

  useEffect(() => {
    onChange(inputText, true);
  }, [props.showMentions]);

  const updateMentionsMap = (selc, count, shouldAdd) => {
    mentionsMap.current = EU.updateRemainingMentionsIndexes(
      mentionsMap.current,
      selc,
      count,
      shouldAdd,
    );
  };

  const startTracking = (mentionIndex) => {
    hasTrackingStarted.current = true;
    menIndex.current = mentionIndex;

    setIsTrackingStarted(true);
    props.onUpdateSuggestions('');
    props.onTrackingStateChange(true);
  };

  const stopTracking = () => {
    hasTrackingStarted.current = false;
    // closeSuggestionsPanel();
    setIsTrackingStarted(false);

    props.onTrackingStateChange(false);
    props.onHideMentions();
  };

  const updateSuggestions = (lastKeyword) => {
    props.onUpdateSuggestions(lastKeyword);
  };

  const identifyKeyword = (input) => {
    /**
     * filter the mentions list
     * according to what user type with
     * @ char e.g. @billroy
     */
    if (hasTrackingStarted.current) {
      let pattern = null;
      if (triggerLocation.current === 'new-word-only') {
        pattern = new RegExp(
          `\\B${trigger.current}[a-z0-9_-]+|\\B${trigger.current}`,
          `gi`,
        );
      } else {
        //anywhere
        pattern = new RegExp(
          `\\${trigger.current}[a-z0-9_-]+|\\${trigger.current}`,
          `i`,
        );
      }
      const str = input.substr(menIndex.current);
      if (!str) {
        return;
      }
      const keywordArray = str?.match(pattern) ?? [];
      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1];
        updateSuggestions(lastKeyword);
      }
    }
  };

  const checkForMention = (input, selc) => {
    /**
     * Open mentions list if user
     * start typing @ in the string anywhere.
     */
    const mentionIndex = selc.start - 1;
    // const lastChar = input.substr(input.length - 1);
    const lastChar = input.substr(mentionIndex, 1);
    const wordBoundry =
      triggerLocation.current === 'new-word-only'
        ? previousChar.current.trim().length === 0
        : true;
    // if (lastChar === trigger.current && wordBoundry) {
    if (
      lastChar === trigger.current &&
      input.length - 1 === mentionIndex &&
      wordBoundry
    ) {
      startTracking(mentionIndex);
    } else if (lastChar.trim() === '' && hasTrackingStarted.current) {
      stopTracking();
    }
    previousChar.current = lastChar;
    identifyKeyword(input);
  };

  const getInitialAndRemainingStrings = (input, mentionIndex) => {
    /**
     * extractInitialAndRemainingStrings
     * this function extract the initialStr and remainingStr
     * at the point of new Mention string.
     * Also updates the remaining string if there
     * are any adjcent mentions text with the new one.
     */
    let initialStr = input.substr(0, mentionIndex).trim();
    if (!EU.isEmpty(initialStr)) {
      initialStr = initialStr + ' ';
    }
    /**
     * remove the characters adjcent with @ sign
     * and extract the remaining part
     */
    let remStr =
      input
        .substr(mentionIndex + 1)
        .replace(/\s+/, '\x01')
        .split('\x01')[1] || '';

    /**
     * check if there are any adjecent mentions
     * subtracted in current selection.
     * add the adjcent mentions
     * @tim@nic
     * add nic back
     */
    const adjMentIndexes = {
      start: initialStr.length - 1,
      end: input.length - remStr.length - 1,
    };
    const mentionKeys = EU.getSelectedMentionKeys(
      mentionsMap.current,
      adjMentIndexes,
    );
    mentionKeys.forEach((key) => {
      remStr = `@${mentionsMap.current.get(key).username} ${remStr}`;
    });

    return {
      initialStr,
      remStr,
    };
  };

  const onSuggestionTap = (user) => {
    /**
     * When user select a mention.
     * Add a mention in the string.
     * Also add a mention in the map
     */
    const { initialStr, remStr } = getInitialAndRemainingStrings(
      inputTextCopy.current,
      menIndex.current,
    );

    const username = `@${user.username}`;
    const text = `${initialStr}${username} ${remStr}`;
    //'@[__display__](__id__)' ///find this trigger parsing from react-mentions

    //set the mentions in the map.
    const menStartIndex = initialStr.length;
    const menEndIndex = menStartIndex + (username.length - 1);

    mentionsMap.current.set([menStartIndex, menEndIndex], user);

    // update remaining mentions indexes
    let charAdded = Math.abs(text.length - inputTextCopy.current.length);
    updateMentionsMap(
      {
        start: menEndIndex + 1,
        end: text.length,
      },
      charAdded,
      true,
    );
    const newFormattedText = formatText(text);
    setFormattedText(newFormattedText);
    setInputText(text);
    inputTextCopy.current = text;

    stopTracking();
    sendMessageToFooter(text);
  };

  props.richTextInputRef.current = {
    onSuggestionTap: (user) => onSuggestionTap(user),
  };

  const handleSelectionChange = ({
    nativeEvent: { selection: newSelection },
  }) => {
    const prevSelc = selection;
    let newSelc = { ...newSelection };
    if (newSelc.start !== newSelc.end) {
      /**
       * if user make or remove selection
       * Automatically add or remove mentions
       * in the selection.
       */
      newSelc = EU.addMenInSelection(newSelc, prevSelc, mentionsMap.current);
    }
    // else{
    /**
     * Update cursor to not land on mention
     * Automatically skip mentions boundry
     */
    // setTimeout(()=>{

    // })
    // newSelc = EU.moveCursorToMentionBoundry(newSelc, prevSelc, mentionsMap.current, isTrackingStarted);
    // }
    setSelection(newSelc);
    checkForMention(inputTextCopy.current, newSelc);
  };

  const formatMentionNode = (txt, key) => (
    <Text key={key} style={mentionStyle.mention}>
      {txt}
    </Text>
  );

  const formatText = (input) => {
    /**
     * Format the Mentions
     * and display them with
     * the different styles
     */
    if (input === '' || !mentionsMap.current.size) return input;
    const newFormattedText = [];
    let lastIndex = 0;
    mentionsMap.current.forEach((men, [start, end]) => {
      const initialStr = start === 1 ? '' : input.substring(lastIndex, start);
      lastIndex = end + 1;
      newFormattedText.push(initialStr);
      const formattedMention = formatMentionNode(
        // `${men.username}`,
        `@${men.username}`,
        `${start}-${men.id}-${end}`,
      );
      newFormattedText.push(formattedMention);
      if (
        EU.isKeysAreSame(EU.getLastKeyInMap(mentionsMap.current), [start, end])
      ) {
        const lastStr = input.substr(lastIndex); //remaining string
        newFormattedText.push(lastStr);
      }
    });
    return newFormattedText;
  };

  const formatTextWithMentions = (input) => {
    if (input === '' || !mentionsMap.current.size) return input;
    let newFormattedText = '';
    let lastIndex = 0;
    mentionsMap.current.forEach((men, [start, end]) => {
      const initialStr = start === 1 ? '' : input.substring(lastIndex, start);
      lastIndex = end + 1;
      newFormattedText = newFormattedText.concat(initialStr);
      newFormattedText = newFormattedText.concat(
        `@[${men.username}](id:${men.id})`,
      );
      if (
        EU.isKeysAreSame(EU.getLastKeyInMap(mentionsMap.current), [start, end])
      ) {
        const lastStr = input.substr(lastIndex); //remaining string
        newFormattedText = newFormattedText.concat(lastStr);
      }
    });
    return newFormattedText;
  };

  const sendMessageToFooter = (text) => {
    props.onChange({
      displayText: text,
      text: formatTextWithMentions(text),
    });
  };

  const onChange = (input, fromAtBtn) => {
    let text = input;
    const prevText = inputText;
    let selectionCopy = { ...selection };
    if (fromAtBtn) {
      //update selection but don't set in state
      //it will be auto set by input
      selectionCopy.start = selectionCopy.start + 1;
      selectionCopy.end = selectionCopy.end + 1;
    }
    if (text.length < prevText.length) {
      /**
       * if user is back pressing and it
       * deletes the mention remove it from
       * actual string.
       */

      let charDeleted = Math.abs(text.length - prevText.length);
      const totalSelection = {
        start: selectionCopy.start,
        end:
          charDeleted > 1
            ? selectionCopy.start + charDeleted
            : selectionCopy.start,
      };
      /**
       * REmove all the selected mentions
       */
      if (totalSelection.start === totalSelection.end) {
        //single char deleting
        const key = EU.findMentionKeyInMap(
          mentionsMap.current,
          totalSelection.start,
        );
        if (key && key.length) {
          mentionsMap.current.delete(key);
          /**
           * don't need to worry about multi-char selection
           * because our selection automatically select the
           * whole mention string.
           */
          const initial = text.substring(0, key[0]); //mention start index
          text = initial + text.substr(key[1]); // mentions end index
          charDeleted = charDeleted + Math.abs(key[0] - key[1]); //1 is already added in the charDeleted
          // selection = {
          //     start: ((charDeleted+selection.start)-1),
          //     end: ((charDeleted+selection.start)-1)
          // }
          mentionsMap.current.delete(key);
        }
      } else {
        //multi-char deleted
        const mentionKeys = EU.getSelectedMentionKeys(
          mentionsMap.current,
          totalSelection,
        );
        mentionKeys.forEach((key) => {
          mentionsMap.current.delete(key);
        });
      }
      /**
       * update indexes on charcters remove
       * no need to worry about totalSelection End.
       * We already removed deleted mentions from the actual string.
       * */
      updateMentionsMap(
        {
          start: selectionCopy.end,
          end: prevText.length,
        },
        charDeleted,
        false,
      );
    } else {
      //update indexes on new charcter add

      let charAdded = Math.abs(text.length - prevText.length);
      updateMentionsMap(
        {
          start: selectionCopy.end,
          end: text.length,
        },
        charAdded,
        true,
      );
      /**
       * if user type anything on the mention
       * remove the mention from the mentions array
       * */
      if (selectionCopy.start === selectionCopy.end) {
        const key = EU.findMentionKeyInMap(
          mentionsMap.current,
          selectionCopy.start - 1,
        );
        if (key && key.length) {
          mentionsMap.current.delete(key);
        }
      }
    }

    const newFormattedText = formatText(text);

    setFormattedText(newFormattedText);
    setInputText(text);
    inputTextCopy.current = text;

    // selection,

    checkForMention(text, selectionCopy);
    // const text = `${initialStr} @[${user.username}](id:${user.id}) ${remStr}`; //'@[__display__](__id__)' ///find this trigger parsing from react-mentions

    sendMessageToFooter(text);
  };

  const onContentSizeChange = (evt) => {
    /**
     * this function will dynamically
     * calculate editor height w.r.t
     * the size of text in the input.
     */
    if (evt) {
      // const iosTextHeight = 20.5
      const androidTextHeight = 20.5;
      // const textHeight = Platform.OS === 'ios' ? iosTextHeight : androidTextHeight

      const height =
        Platform.OS === 'ios'
          ? evt.nativeEvent.contentSize.height
          : evt.nativeEvent.contentSize.height - androidTextHeight;
      let editHeight = 40;
      editHeight = editHeight + height;
      setEditorHeight(editHeight);
    }
  };

  const { editorStyles = {} } = props;
  if (!props.showEditor) return null;

  return (
    <CustomTextInput
      inputRef={props.inputRef}
      editorStyles={editorStyles}
      editorHeight={editorHeight}
      appStyles={props.appStyles}
      formattedText={formattedText}
      placeholder={placeholder}
      inputText={inputText}
      // selection={selection}
      onChange={onChange}
      handleSelectionChange={handleSelectionChange}
      onContentSizeChange={onContentSizeChange}
    />
  );
}

IMRichTextInput.defaultProps = {
  richTextInputRef: { current: {} },
};

export default IMRichTextInput;
