[![Tests status](https://github.com/UziTech/action-setup-atom/workflows/Tests/badge.svg)](https://github.com/UziTech/action-setup-atom/actions)

# Setup Atom and APM in GitHub actions

This action downloads Atom and adds `atom` and `apm` to the `PATH`

## Inputs

### `channel`

**Required** The channel to test. Default `"stable"`.

## Example usage

```
uses: UziTech/action-setup-atom@v1
with:
  channel: 'beta'
```
