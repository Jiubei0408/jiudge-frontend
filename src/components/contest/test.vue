<template>
  <base-box-frame>
    <p style="font-size: 20px">Prime Permutation</p>
    <el-divider/>
    <latex-viewer :text="test"/>
  </base-box-frame>
</template>

<script>
import LatexViewer from "@/components/globals/latex-viewer";
import BaseBoxFrame from "@/components/globals/base-box-frame";

const test = '<div class="problem-statement"><div class="section-title">Statement</div><div><p>You are given a string <span class="tex-span"><i>s</i></span>, consisting of small Latin letters. Let\'s denote the length of the string as <span class="tex-span">|<i>s</i>|</span>. The characters in the string are numbered starting from <span class="tex-span">1</span>. </p><p>Your task is to find out if it is possible to rearrange characters in string <span class="tex-span"><i>s</i></span> so that for any prime number <span class="tex-span"><i>p</i> ≤ |<i>s</i>|</span> and for any integer <span class="tex-span"><i>i</i></span> ranging from <span class="tex-span">1</span> to <span class="tex-span">|<i>s</i>| / <i>p</i></span> (inclusive) the following condition was fulfilled <span class="tex-span"><i>s</i><sub class="lower-index"><i>p</i></sub> = <i>s</i><sub class="lower-index"><i>p</i> × <i>i</i></sub></span>. If the answer is positive, find one way to rearrange the characters.</p></div><div class="input-specification"><div class="section-title">Input</div><p>The only line contains the initial string <span class="tex-span"><i>s</i></span>, consisting of small Latin letters (<span class="tex-span">1 ≤ |<i>s</i>| ≤ 1000</span>).</p></div><div class="output-specification"><div class="section-title">Output</div><p>If it is possible to rearrange the characters in the string so that the above-mentioned conditions were fulfilled, then print in the first line "<span class="tex-font-style-tt">YES</span>" (without the quotes) and print on the second line one of the possible resulting strings. If such permutation is impossible to perform, then print the single string "<span class="tex-font-style-tt">NO</span>".</p></div><div class="sample-tests"><div class="section-title">Examples</div><div class="sample-test"><div class="input"><div class="title">Input</div><pre>abc<br/></pre></div><div class="output"><div class="title">Output</div><pre>YES<br/>abc<br/></pre></div><div class="input"><div class="title">Input</div><pre>abcd<br/></pre></div><div class="output"><div class="title">Output</div><pre>NO<br/></pre></div><div class="input"><div class="title">Input</div><pre>xxxyxxx<br/></pre></div><div class="output"><div class="title">Output</div><pre>YES<br/>xxxxxxy<br/></pre></div></div></div><div class="note"><div class="section-title">Note</div><p>In the first sample any of the six possible strings will do: "abc", "acb", "bac", "bca", "cab" or "cba".</p><p>In the second sample no letter permutation will satisfy the condition at <span class="tex-span"><i>p</i> = 2</span> (<span class="tex-span"><i>s</i><sub class="lower-index">2</sub> = <i>s</i><sub class="lower-index">4</sub></span>).</p><p>In the third test any string where character "y" doesn\'t occupy positions 2, 3, 4, 6 will be valid.</p></div></div>'

export default {
  name: "test.vue",
  components: {BaseBoxFrame, LatexViewer},
  data() {
    return {
      test: test
    }
  }
}
</script>
<style scoped>

</style>
