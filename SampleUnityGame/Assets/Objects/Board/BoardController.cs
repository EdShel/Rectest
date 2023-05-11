using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class BoardController : MonoBehaviour
{
    private const int AREA_WIDTH = 5;
    private const int AREA_HEIGHT = 3;

    public Material ActivatedCardMaterial;
    public Material DeactivatedCardMaterial;

    private GameObject[,] cards;
    private GameObject cursor;

    private Vector2Int cursorPosition;

    void Start()
    {
        int cardsCount = this.transform.childCount - 1;

        var cardsList = new List<Transform>(cardsCount);
        for (int i = 0; i < cardsCount; i++)
        {
            Transform card = this.transform.GetChild(i);
            cardsList.Add(card);
        }

        var rowsAndCols = cardsList.GroupBy(p => p.localPosition.y)
            .ToDictionary(p => p.Key, v => v.OrderBy(p => p.localPosition.x).Select(p => p.gameObject).ToArray())
            .OrderBy(p => p.Key)
            .Select(p => p.Value)
            .ToArray();
        this.cards = new GameObject[AREA_WIDTH, AREA_HEIGHT];
        for (int y = 0; y < AREA_HEIGHT; y++)
        {
            for (int x = 0; x < AREA_WIDTH; x++)
            {
                this.cards[x, y] = rowsAndCols[y][x];
            }
        }

        this.cursor = this.transform.GetChild(this.transform.childCount - 1).gameObject;

        ResetGameField();
    }

    void ResetGameField()
    {
        var rng = new System.Random();
        for (int y = 0; y < AREA_HEIGHT; y++)
        {
            for (int x = 0; x < AREA_WIDTH; x++)
            {
                bool isActive = rng.NextDouble() > 0.5d;
                cards[x, y].GetComponent<MeshRenderer>().material = isActive
                    ? ActivatedCardMaterial
                    : DeactivatedCardMaterial;
            }
        }
        SetCursorPosition(AREA_WIDTH / 2, AREA_HEIGHT / 2);
    }

    void SetCursorPosition(int x, int y)
    {
        GameObject card = this.cards[x, y];
        Vector3 cardPosition = card.transform.localPosition;
        this.cursor.transform.localPosition = new Vector3(
            cardPosition.x,
            cardPosition.y,
            this.cursor.transform.localPosition.z
        );
        this.cursorPosition = new Vector2Int(x, y);
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.R))
        {
            ResetGameField();
        }

        int moveX = 0;
        int moveY = 0;
        if (Input.GetKeyDown(KeyCode.D))
        {
            moveX = 1;
        }
        if (Input.GetKeyDown(KeyCode.A))
        {
            moveX = -1;
        }
        if (Input.GetKeyDown(KeyCode.W))
        {
            moveY = 1;
        }
        if (Input.GetKeyDown(KeyCode.S))
        {
            moveY = -1;
        }

        if (moveX != 0 || moveY != 0)
        {
            SetCursorPosition(
                (AREA_WIDTH + (this.cursorPosition.x + moveX)) % AREA_WIDTH,
                (AREA_HEIGHT + (this.cursorPosition.y + moveY)) % AREA_HEIGHT
            );
            GameObject selectedCard = this.cards[this.cursorPosition.x, this.cursorPosition.y];
            MeshRenderer meshRenderer = selectedCard.GetComponent<MeshRenderer>();
            meshRenderer.material = meshRenderer.material.color == this.ActivatedCardMaterial.color
                ? this.DeactivatedCardMaterial 
                : this.ActivatedCardMaterial;
        }
    }
}
