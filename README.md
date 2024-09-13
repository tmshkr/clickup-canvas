# clickup-canvas

This is a simple script to create [ClickUp](https://clickup.com) tasks from [Canvas](https://www.instructure.com/canvas) assignments.

To use it, you'll need your [Canvas API token](https://canvas.instructure.com/doc/api/file.oauth.html#manual-token-generation) and your [ClickUp API token](https://clickup.com/api/developer-portal/authentication/#personal-token).

The script makes use of a [SQLite](https://www.sqlite.org/) database to keep track of which assignments have already been created as tasks.

## Running the script locally

To run the script locally, create a `.env` file in the root of the repository by copying `.env.example`. Add your API keys to the .env file. You'll also need to create a `courses.json` file that contains an array of objects containing your Canvas course IDs and the ClickUp list IDs where you want the tasks to be created. You can use the `courses.example.json` file as a template.

To get your Canvas course IDs, you can use the [Canvas API](https://canvas.instructure.com/doc/api/courses.html#method.courses.index). To get your ClickUp list IDs, you can use the [ClickUp API](https://clickup.com/api/clickupreference/operation/GetLists/) or click `Copy link` on the list and get the last part of the URL after `/li/`.

Once you have your `.env` file and your `courses.json` file, you can install the dependencies, create the database, and run the script:

```bash
npm install
npx prisma db push
npm run main
```

## Running the script as a GitHub Action

To run the script as a GitHub Action, create a new repository, where your SQLite database will be stored. Add your JSON file containing list IDs and course IDs, and you'll also need to add your API keys as [secrets in the repository settings](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions?tool=webui#creating-secrets-for-a-repository).

```yaml
name: sync
on:
  workflow_dispatch:
  schedule:
    - cron: "0 7 * * *" # every day at 07:00 UTC

jobs:
  sync:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: tmshkr/clickup-canvas@v1
        with:
          canvas_api_token: ${{ secrets.CANVAS_API_TOKEN }}
          clickup_api_key: ${{ secrets.CLICKUP_API_KEY }}
          domain: myschool.instructure.com
      - name: Save db file
        run: |
          git config --global user.name "${{ github.actor }}"
          git config --global user.email "${{ github.actor }}@users.noreply.github.com"
          git add data.db
          git commit -m "Update db file" || true
          git push
```
