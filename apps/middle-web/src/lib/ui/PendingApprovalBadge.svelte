<script lang="ts">
  interface Props {
    label: string;
  }

  const { label }: Props = $props();
</script>

<span class="pending-badge mono">{label}</span>

<style>
  .pending-badge {
    display: inline-block;
    border: 1px dashed var(--rule-strong);
    color: var(--ink-soft);
    padding: 0.1em 0.5em;
    font-size: var(--step--1);
    letter-spacing: 0.03em;
  }
</style>
