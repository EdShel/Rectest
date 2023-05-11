using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraScript : MonoBehaviour
{
    private Transform parentTransform;
    private Camera cameraComponent;

    void Start()
    {
        this.parentTransform = this.transform.parent;
        this.cameraComponent = this.GetComponent<Camera>();
    }

    void Update()
    {
        float sceneWidth = this.parentTransform.localScale.x;
        float unitsPerPixel = sceneWidth / Screen.width;
        cameraComponent.orthographicSize = 0.5f * unitsPerPixel * Screen.height;
    }
}
